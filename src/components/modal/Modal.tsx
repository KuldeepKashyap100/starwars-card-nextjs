import NextImage from "next/image";
import styles from "./Modal.module.css";
import { ReactNode } from "react";
import Close from "../icons/Close";

export default function Modal({
  children,
  onClose = () => {}
}: {
  children: ReactNode;
  onClose?: () => void
}) {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.modal}>
        <Close className="h-6 w-6 absolute top-2 right-2 " onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
