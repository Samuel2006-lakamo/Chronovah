export default function Footer() {
  return (
    <footer className="py-6 h-16 relative -top-0.5 -bottom-2 text-center dark:opacity-100 opacity-60 text-sm dark:bg-gray-900 dark:text-white">
      LifePanel © {new Date().getFullYear()}
    </footer>
  );
}
