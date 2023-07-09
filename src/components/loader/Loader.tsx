import NextImage from "next/image";

import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <NextImage
        style={{ animationDuration: "2s" }}
        className={styles.loaderImg}
        width={100}
        height={100}
        src="/loader-blue.svg"
        alt={""}
      />
    </div>
  );
}
