import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const SocialIcons = [
  { icon: '𝕏', label: 'Twitter' },
  { icon: 'f', label: 'Facebook' },
  { icon: '▶', label: 'YouTube' },
  { icon: '📷', label: 'Instagram' },
];

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black text-white">swiggy<span className="text-primary">.</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            India's leading food ordering & delivery platform. 
            Hot meals at your door in 30 minutes or less.
          </p>
          <div className="flex gap-3">
            {SocialIcons.map((s) => (
              <a key={s.label} href="#" aria-label={s.label}
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold text-white">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2.5">
            {['About Us', 'Careers', 'Team', 'Swiggy One', 'Stories', 'Press Kit'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm hover:text-primary transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-4">Help & Support</h4>
          <ul className="space-y-2.5">
            {['Help Centre', 'Report an Issue', 'Partner with Us', 'Register Your Restaurant', 'Cookie Policy', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm hover:text-primary transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm">
              <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
              Bundl Technologies Pvt. Ltd., Bangalore, Karnataka 560008
            </li>
            <li className="flex items-center gap-2.5 text-sm">
              <Phone size={16} className="text-primary flex-shrink-0" />
              1800-208-1000
            </li>
            <li className="flex items-center gap-2.5 text-sm">
              <Mail size={16} className="text-primary flex-shrink-0" />
              support@swiggy.com
            </li>
          </ul>

          <div className="mt-6 space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Download Our App</p>
            {['App Store', 'Google Play'].map((s) => (
              <a key={s} href="#"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors">
                <span className="text-xs font-medium text-white">{s}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Bundl Technologies Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
