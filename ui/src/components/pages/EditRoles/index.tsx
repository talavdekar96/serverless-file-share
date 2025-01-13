import { Button } from "@cloudscape-design/components";
import {
  Checkbox,
  FormField,
  Header,
  Input,
} from "@cloudscape-design/components";
import { ContentLayout } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ApiService } from "../../../services/ApiService";

export const EditRoles = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role;

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState({
    canRead: false,
    canUpload: false,
    canDelete: false,
    canShare: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setRoleName(role.name || "");
      setRoleDescription(role.description || "");
      setPermissions({
        canRead: role.privileges?.canRead ?? true,
        canUpload: role.privileges?.canUpload ?? true,
        canDelete: role.privileges?.canDelete ?? true,
        canShare: role.privileges?.canShare ?? true,
      });
    } else {
      navigate("/roles");
    }
  }, [role, navigate]);

  const handleNameChange = (value: string) => {
    setRoleName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setRoleDescription(value);
  };

  const handlePermissionChange = (permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission as keyof typeof prev],
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    if (!roleName?.trim()) {
      newErrors.name = "Role name is required";
    }

    if (!roleDescription?.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiService.getInstance().updateRole(role.roleId, {
        name: roleName,
        description: roleDescription,
        privileges: {
          canDelete: permissions.canDelete,
          canRead: permissions.canRead,
          canUpload: permissions.canUpload,
          canShare: permissions.canShare,
        },
      });

      navigate("/roles");
    } catch (error: any) {
      console.error("Failed to update role:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update role";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContentLayout header={<Header variant="h1"> Create Role </Header>}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ flex: 1, paddingLeft: "10px" }}>
          <FormField
            label="Role Name"
            controlId="role-name"
            errorText={errors.name}
          >
            <Input
              ariaLabel="Role Name"
              value={roleName}
              onChange={(e) => handleNameChange(e.detail.value)}
            />
          </FormField>
        </div>

        <div style={{ flex: 2, paddingLeft: "10px" }}>
          <FormField
            label="Description"
            controlId="description"
            errorText={errors.description}
          >
            <Input
              ariaLabel="Description"
              value={roleDescription}
              onChange={(e) => handleDescriptionChange(e.detail.value)}
            />
          </FormField>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ width: "100%" }}>
          <FormField label="Permissions" controlId="permissions">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Checkbox
                checked={permissions.canRead}
                onChange={() => handlePermissionChange("canRead")}
              >
                Can Read
              </Checkbox>
              <Checkbox
                checked={permissions.canUpload}
                onChange={() => handlePermissionChange("canUpload")}
              >
                Can Upload
              </Checkbox>
              <Checkbox
                checked={permissions.canDelete}
                onChange={() => handlePermissionChange("canDelete")}
              >
                Can Delete
              </Checkbox>
              <Checkbox
                checked={permissions.canShare}
                onChange={() => handlePermissionChange("canShare")}
              >
                Can Share
              </Checkbox>
            </div>
          </FormField>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Update Role
        </Button>
      </div>
    </ContentLayout>
  );
};

export default EditRoles;
