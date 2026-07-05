import styles from "./page.module.css";
import { TodoApp } from "./todo-app";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title} data-testid="page-title">
          Todos
        </h1>
        <TodoApp />
      </main>
    </div>
  );
}
