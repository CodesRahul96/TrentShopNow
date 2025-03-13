export default function Footer() {
  return (
    <footer className="bg-background text-text p-6 mt-auto shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} TrentShopNow. All rights reserved.</p>
        <div className="mt-3 flex justify-center space-x-6">
          <a href="#" className="text-primary hover:text-accent transition-colors">About</a>
          <a href="#" className="text-primary hover:text-accent transition-colors">Contact</a>
          <a href="#" className="text-primary hover:text-accent transition-colors">Terms</a>
          <a href="#" className="text-primary hover:text-accent transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}