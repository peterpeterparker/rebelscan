import styles from './Spinner.module.scss';

const Spinner = () => {
  return (
    <svg viewBox="0 0 36 36" className={`${styles.spinner}`}>
      <circle cx="18" cy="18" r="15" stroke-width="4"></circle>
    </svg>
  );
};

export default Spinner;
