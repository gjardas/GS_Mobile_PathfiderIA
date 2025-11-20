import { createContext, useContext, useState } from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext({});

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: null,
    confirmText: "OK",
    cancelText: null,
    type: "default",
  });

  const showAlert = (title, message, options = {}) => {
    const {
      text = "OK",
      onPress = () => {},
      style = "default",
      cancelText = null,
      onCancel = null,
    } = options;

    setAlertState({
      visible: true,
      title,
      message,
      onConfirm: () => {
        setAlertState((prev) => ({ ...prev, visible: false }));
        if (onPress) onPress();
      },
      onCancel: cancelText
        ? () => {
            setAlertState((prev) => ({ ...prev, visible: false }));
            if (onCancel) onCancel();
          }
        : null,
      confirmText: text,
      cancelText: cancelText,
      type: style === "destructive" ? "error" : "default",
    });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        type={alertState.type}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
