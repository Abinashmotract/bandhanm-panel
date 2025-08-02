import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd } from "@mui/icons-material";
import Cookies from "js-cookie";
import { Trash } from "lucide-react";
import SelectInput from "../custom/Select";
import serviceOptions from "../json/serviceOptions";

const EntityDialog = ({
  open,
  handleClose,
  dialogTitle = "Add New Category",
  apiEndpoint = "/category/admin/insert",
  fetchAll = () => { },
  inputLabel = "Category Name",
  buttonText = "Add Category",
  onSuccess = () => { },
  isEdit = false,
  editId = null,
  editValue = "",
  isView = false,
  viewValue = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [subServices, setSubServices] = useState([]);
  const [subServicesLoading, setSubServicesLoading] = useState(false);
  const [deletingSubId, setDeletingSubId] = useState(null);
  const [customOtherValue, setCustomOtherValue] = useState("");

  const authToken = Cookies.get("token");
  console.log("viewValue:", viewValue);

  useEffect(() => {
    if (!open) {
      setInputValue("");
    } else if (isEdit && editValue) {
      setInputValue(editValue);
    } else if (isView && viewValue) {
      setInputValue(viewValue);
    }
  }, [open, isEdit, editValue, isView, viewValue]);

  const handleAddOrUpdate = async () => {
    const selectedValue = inputValue === "other" ? customOtherValue : inputValue;
    if (!selectedValue.trim()) {
      showCustomMessage(`${inputLabel} is required!`);
      return;
    }

    setLoading(true);
    try {
      const requestData = { name: selectedValue };
      const token = Cookies.get("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (isEdit && editId) {
        const response = await axios.patch(
          `${API_BASE_URL}/product-category/admin/update/${editId}`,
          requestData,
          { headers }
        );
        if (response?.data?.status === 200) {
          showSuccessToast(response?.data?.message || `${inputLabel} updated successfully`);
          setInputValue("");
          onSuccess();
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}${apiEndpoint}`,
          requestData,
          { headers }
        );
        if (response?.data?.status === 201) {
          showSuccessToast(response?.data?.message || `${inputLabel} added successfully`);
          setInputValue("");
          onSuccess();
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken && isView && open && viewValue?.id) {
      getAllServicesByServiceId(viewValue.id);
    }
  }, [authToken, isView, open, viewValue]);

  const getAllServicesByServiceId = async (serviceId) => {
    setSubServicesLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/service/subservice/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.status === 200) {
        const matched = response?.data?.data.filter(
          (item) => item?.service?._id === serviceId
        );
        setSubServices(matched);
      }
    } catch (error) {
      showErrorToast("Error fetching services");
    } finally {
      setSubServicesLoading(false);
    }
  }

  const handleDeleteSubservice = async (subserviceId) => {
    setDeletingSubId(subserviceId);
    try {
      const response = await axios.delete(`${API_BASE_URL}/service/subservice/delete/${subserviceId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status === 200) {
        showSuccessToast("Subservice deleted successfully.");
        setSubServices((prev) => prev.filter((sub) => sub._id !== subserviceId));
      } else {
        throw new Error(response?.data?.message || "Failed to delete subservice.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error deleting subservice.");
    } finally {
      setDeletingSubId(null);
    }
  };


  const handleDialogClose = () => {
    setInputValue("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" className="fw-bold">
          {isView ? `View ${inputLabel}` : isEdit ? `Edit ${inputLabel}` : dialogTitle}
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "black" }} />
      <DialogContent>
        {isView ? (
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} pb={1} borderBottom="1px solid #ccc">
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>Name</InputLabel>
              <Typography sx={{ fontWeight: 500 }}>{viewValue?.name || "N/A"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>Status</InputLabel>
              <Chip
                label={
                  viewValue?.approved !== undefined
                    ? viewValue.approved
                      ? "Active"
                      : "Inactive"
                    : "N/A"
                }
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  minWidth: 80,
                  textAlign: "center",
                  color: "#fff",
                  backgroundColor:
                    viewValue?.approved === undefined
                      ? "#9e9e9e"
                      : viewValue.approved
                        ? "#4caf50"
                        : "#f44336",
                  border: "none",
                }}
              />
            </Box>

            <Divider sx={{ borderBottomWidth: 1, borderColor: "black", my: 2 }} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Sub Services
              </Typography>
              {subServicesLoading ? (
                <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                  Loading subservices...
                </Typography>
              ) : Array.isArray(subServices) && subServices.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {subServices.map((sub, index) => (
                    <Chip
                      key={sub?._id || index}
                      label={sub?.name}
                      onDelete={() => handleDeleteSubservice(sub._id)}
                      deleteIcon={
                        deletingSubId === sub._id ? (
                          <CircularProgress size={18} color="error" />
                        ) : (
                          <Trash color="#d32f2f" size={18} />
                        )
                      }
                      variant="outlined"
                      sx={{
                        fontWeight: 'bold',
                        color: '#4a148c',
                        borderColor: '#6d295a',
                        backgroundColor: '#f3e5f5',
                        px: 1.5,
                        py: 0.5,
                        fontSize: 14,
                        borderRadius: '8px',
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                  No subservices found.
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <>
            <InputLabel sx={{ color: "black" }}>{inputLabel}</InputLabel>
            {(!isEdit && !isView) ? (
              <>
                <SelectInput
                  value={inputValue}
                  onChange={e => {
                    setInputValue(e.target.value);
                    if (e.target.value !== "other") setCustomOtherValue("");
                  }}
                  options={serviceOptions}
                  placeholder={`Select ${inputLabel.toLowerCase()}`}
                  height={50}
                  disabled={isView}
                />
                {inputValue === "other" && (
                  <Input
                    placeholder={`Enter custom ${inputLabel.toLowerCase()}`}
                    type="text"
                    height={50}
                    value={customOtherValue}
                    onChange={e => setCustomOtherValue(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                )}
              </>
            ) : (
              <Input
                placeholder={`Write ${inputLabel.toLowerCase()}`}
                type="text"
                height={50}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isView}
              />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleDialogClose} />
        {!isView && (
          <CustomIconButton
            icon={<PersonAdd />}
            loading={loading}
            disabled={loading}
            color="black"
            text={isEdit ? "Update" : buttonText}
            onClick={handleAddOrUpdate}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EntityDialog;
