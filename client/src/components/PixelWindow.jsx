import PixelIcon from './PixelIcon';

// A retro-OS window: title bar with fake min / max / close buttons, then the content.
// The controls are decoration only, so they are hidden from assistive tech.
export default function PixelWindow({ title, children, className = '' }) {
  return (
    <section className={`pw ${className}`}>
      <div className="pw-bar">
        <span className="pw-title">{title}</span>
        <span className="pw-controls" aria-hidden="true">
          <span className="pw-ctl"><PixelIcon name="min" size={2} /></span>
          <span className="pw-ctl"><PixelIcon name="max" size={2} /></span>
          <span className="pw-ctl"><PixelIcon name="close" size={2} /></span>
        </span>
      </div>
      <div className="pw-body">{children}</div>
    </section>
  );
}
