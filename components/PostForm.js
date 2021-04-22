import styles from '../styles/PostForm.module.css';

export default function PostForm({values, handleOnChange, onFormSubmit, submitText}) {

  return (
    <form className={styles.form} onSubmit={onFormSubmit}>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Title</label>
        <input
          name="title"
          placeholder="enter title"
          className={styles.formInput}
          value={values.title}
          onChange={(e) => handleOnChange("title", e.target.value)}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Body</label>
        <textarea
          name="body"
          placeholder="enter body"
          className={styles.formInput}
          value={values.body}
          onChange={(e) => handleOnChange("body", e.target.value)}
        ></textarea>
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Author</label>
        <input
          name="author"
          placeholder="enter author"
          className={styles.formInput}
          value={values.author}
          onChange={(e) => handleOnChange("author", e.target.value)}
        />
      </div>
      <button type="submit" className={styles.btn}>
        {submitText}
      </button>
    </form>
  );
}