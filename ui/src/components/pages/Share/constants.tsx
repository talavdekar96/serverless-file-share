import { componentTypes, validatorTypes } from "@aws-northstar/ui";
import {
  useFieldApi,
  useFormApi,
} from "@data-driven-forms/react-form-renderer";
import { useEffect, useState } from "react";

import { EMAIL_REGEX } from "../../../helpers/constants";
import { ApiService } from "../../../services/ApiService";
import { FileUploadComponent } from "./components/FileUploadComponent";
import { ReviewTemplate } from "./components/ReviewTemplate";
import { SelectExistingFile } from "./components/SelectExistingFile";

interface CustomComponentProps {
  value?: RecipientEmail[];
  onChange: (value: RecipientEmail[]) => void;
}

// interface WizardValues {
//   groupRecipients?: RecipientEmail[];
//   recipients?: RecipientEmail[];
//   [key: string]: any;  // For other form values
// }

interface MemberDetails {
  groupDetails?: {
    [groupId: string]: {
      groupId: string;
      groupName: string;
      members: {
        email: string;
        notify: boolean;
      }[];
    };
  };
  individualRecipients?: {
    recipientEmail: string;
    notify: boolean;
  }[];
}

// Change from let to const
const storedMemberDetails: MemberDetails = {};

export const selectFileStep = {
  name: "step-select-file",
  title: "Select a file",
  fields: [
    {
      component: "radio",
      label: "Which file do you want to share?",
      isRequired: true,
      name: "source",
      options: [
        {
          label: "Upload a new file",
          description: "Upload a file and store it in this application",
          value: "upload",
        },
        {
          label: "Select an existing file",
          description: "Share an existing file that has already been uploaded",
          value: "existing",
        },
      ],
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      wrapperProps: {
        style: {
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        },
      },
    },
    {
      component: componentTypes.CUSTOM,
      label: "Select a file",
      description: "Click below to select an existing file",
      CustomComponent: SelectExistingFile,
      isRequired: true,
      name: "existingFile",
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: "Please select a file to continue",
        },
      ],
      condition: {
        when: "source",
        is: "existing",
      },
    },
    {
      component: componentTypes.CUSTOM,
      label: "Upload file",
      description: "Click below to select a file to upload",
      CustomComponent: FileUploadComponent,
      isRequired: true,
      name: "uploadedFiles",
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: "Please upload a file to continue",
        },
      ],
      condition: {
        when: "source",
        is: "upload",
      },
      wrapperProps: {
        style: {
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        },
      },
    },
  ],
};

// interface WizardValues {
//   groupRecipients?: RecipientEmail[];
//   recipients?: RecipientEmail[];
//   [key: string]: any; // For other form values
// }

export const shareSteps = [
  {
    name: "step-select-recipients",
    title: "Select recipients",
    fields: [
      {
        component: componentTypes.CUSTOM,
        name: "groupRecipients",
        label: "Select Recipients",
        CustomComponent: ({ value = [], onChange }: CustomComponentProps) => {
          const [groups, setGroups] = useState<Group[]>([]);
          const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
            new Set()
          );
          const [notifications, setNotifications] = useState<
            Record<string, boolean>
          >({});
          const formApi = useFormApi();

          useEffect(() => {
            const loadGroups = async () => {
              const apiService = ApiService.getInstance();
              const response = await apiService.getGroups();
              setGroups(response.groups);
              console.log("Available groups:", response.groups);
            };
            loadGroups();
          }, []);

          useEffect(() => {
            // When selected recipients change, store the details in the form
            const recipientDetails = Array.from(selectedGroupIds).flatMap(
              (groupId) => {
                const group = groups.find((g) => g.groupId === groupId);
                if (!group) return [];

                return group.members.map((member) => ({
                  username: member.username,
                  notify: notifications[groupId] || false,
                }));
              }
            );

            formApi.change("selectedRecipientDetails", recipientDetails);
          }, [selectedGroupIds, groups, notifications]);

          const handleCheckboxChange = (group: Group, checked: boolean) => {
            console.log("=== Group Selection Debug ===");
            console.log("Selected group:", group);
            console.log("Group members:", group.members);

            const newSelectedGroupIds = new Set(selectedGroupIds);
            if (checked) {
              newSelectedGroupIds.add(group.groupId);
            } else {
              newSelectedGroupIds.delete(group.groupId);
            }
            setSelectedGroupIds(newSelectedGroupIds);

            if (typeof onChange === "function") {
              const allRecipients = Array.from(newSelectedGroupIds).flatMap(
                (groupId) => {
                  const group = groups.find((g) => g.groupId === groupId);
                  if (!group) return [];

                  return group.members.map((member) => ({
                    recipientEmail: member.username,
                    notify: notifications[groupId] || false,
                  }));
                }
              );

              onChange(allRecipients);

              if (checked) {
                const currentRecipients =
                  formApi.getState().values.recipients || [];
                console.log(
                  "Current recipients before adding group:",
                  currentRecipients
                );

                const newGroupMembers = group.members.map((member) => ({
                  recipientEmail: member.username,
                  notify: notifications[group.groupId] || false,
                }));
                console.log("New group members to add:", newGroupMembers);

                const uniqueRecipients = [...currentRecipients];
                newGroupMembers.forEach((member) => {
                  if (
                    !uniqueRecipients.some(
                      (r: RecipientEmail) =>
                        r.recipientEmail === member.recipientEmail
                    )
                  ) {
                    uniqueRecipients.push(member);
                  }
                });
                console.log(
                  "Final recipients after adding group:",
                  uniqueRecipients
                );

                formApi.change("recipients", uniqueRecipients);
              } else {
                const currentRecipients =
                  formApi.getState().values.recipients || [];
                const groupEmails = new Set(
                  group.members.map((m) => m.username)
                );
                const filteredRecipients = currentRecipients.filter(
                  (recipient: RecipientEmail) =>
                    !groupEmails.has(recipient.recipientEmail)
                );

                formApi.change("recipients", filteredRecipients);
              }
            }
          };

          const handleNotifyChange = (group: Group, notify: boolean) => {
            const newNotifications = {
              ...notifications,
              [group.groupId]: notify,
            };
            setNotifications(newNotifications);

            if (typeof onChange === "function") {
              const currentRecipients = value || [];

              const groupEmails = new Set(
                group.members.map((member) => member.username)
              );

              const updatedRecipients = currentRecipients.map((recipient) => ({
                recipientEmail: recipient.recipientEmail,
                notify: groupEmails.has(recipient.recipientEmail)
                  ? notify
                  : recipient.notify,
              }));

              console.log("Updating notifications:", updatedRecipients);
              onChange(updatedRecipients);
            }
          };
          const selectedRecipientDetails = Array.from(selectedGroupIds).flatMap(
            (groupId) => {
              const group = groups.find((g) => g.groupId === groupId);
              if (!group) return [];

              return group.members.map((member) => ({
                username: member.username,
                notify: notifications[groupId] || false,
              }));
            }
          );

          console.log("Selected recipient details:", selectedRecipientDetails);
          return (
            <div
            // style={{
            //   backgroundColor: "#fff",
            //   borderRadius: "8px",
            //   padding: "20px",
            //   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            //   marginBottom: "24px",
            // }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "16px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Select Groups
              </h3>
              {groups.length === 0 ? (
                <div>No groups present</div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.groupId}
                    style={{
                      margin: "8px 0",
                      padding: "12px",
                      border: selectedGroupIds.has(group.groupId)
                        ? "2px solid #0066CC"
                        : "2px solid transparent",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        id={group.groupId}
                        name="groupSelection"
                        checked={selectedGroupIds.has(group.groupId)}
                        onChange={(e) =>
                          handleCheckboxChange(group, e.target.checked)
                        }
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#0066CC",
                          cursor: "help",
                        }}
                        title={group.members
                          .map((member) => member.username)
                          .join("\n")}
                      >
                        {group.name}
                      </span>
                    </div>
                    {selectedGroupIds.has(group.groupId) && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Notify?
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`notify-${group.groupId}`}
                            checked={notifications[group.groupId] || false}
                            onChange={(e) =>
                              handleNotifyChange(group, e.target.checked)
                            }
                            style={{
                              cursor: "pointer",
                            }}
                          />
                          <label
                            htmlFor={`notify-${group.groupId}`}
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              color: "#666",
                            }}
                          >
                            Send email notification
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        },
        wrapperProps: {
          style: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          },
        },
      },
      {
        component: "field-array",
        label: "Who do you want to share this file with?",
        description: "Enter the email address of recipients below",
        name: "recipients",
        addButtonText: "Add more recipient",
        variant: "embedded",
        fields: [
          {
            component: "text-field",
            label: "Email address",
            name: "recipientEmail",
            isRequired: true,
            validate: [
              { type: validatorTypes.REQUIRED },
              {
                type: validatorTypes.PATTERN,
                pattern: EMAIL_REGEX,
                message: "Please enter a valid email address",
              },
            ],
          },
          {
            component: "checkbox",
            label: "Notify?",
            description: "Send email notification",
            name: "notify",
          },
        ],
        wrapperProps: {
          style: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: "relative",
            marginTop: "24px",
          },
        },
        labelProps: {
          style: {
            position: "relative",
            paddingTop: "24px",
            marginTop: "-24px",
            borderTop: "1px solid #e0e0e0",
            width: "100%",
          },
        },
      },
    ],
    wrapperProps: {
      style: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "24px",
      },
    },
  },
  {
    name: "step-access-settings",
    title: "Access Settings",
    nextStep: "step-review",
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: "access-header",
        label: "Optional settings to restrict download access",
        element: "h5",
      },
      {
        component: "checkbox",
        label: "Expire link?",
        description: "Expire link after specific date",
        name: "expiryEnabled",
      },
      {
        component: componentTypes.DATE_PICKER,
        description: "Expiry date",
        name: "expiryDate",
        condition: {
          when: "expiryEnabled",
          is: true,
          then: {
            visible: true,
          },
        },
      },
      {
        component: "checkbox",
        label: "Limit downloads?",
        description: "Limit number of times the file can be downloaded",
        name: "limitEnabled",
      },
      {
        component: componentTypes.SELECT,
        description: "Enter a limit (number)",
        name: "limitAmount",
        options: Array.from({ length: 100 }).map((val, i) => {
          return { text: (i + 1).toString(), value: i + 1 };
        }),
        condition: {
          when: "limitEnabled",
          is: true,
          then: {
            visible: true,
          },
        },
      },
    ],
    wrapperProps: {
      style: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "24px",
      },
    },
  },
  {
    name: "step-review",
    title: "Review",
    fields: [
      {
        Template: (details: any) => {
          interface GroupMember {
            username: string;
            notify: boolean;
          }

          interface Recipient {
            recipientEmail: string;
            notify: boolean;
          }

          const enhancedData = {
            ...details.data,
            recipients: [
              ...(details.data.recipients || []),
              ...(details.data.selectedRecipientDetails || []).map(
                (member: GroupMember): Recipient => ({
                  recipientEmail: member.username,
                  notify: member.notify,
                })
              ),
            ],
          };

          console.log("Form data:", enhancedData);
          return <ReviewTemplate {...enhancedData} />;
        },
        component: "REVIEW",
        name: "review",
        wrapperProps: {
          style: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          },
        },
      },
    ],
  },
];
