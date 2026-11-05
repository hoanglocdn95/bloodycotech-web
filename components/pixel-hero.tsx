export function PixelHero() {
  return (
    <div className="pixel-stage" aria-label="Minh họa bàn làm việc lập trình theo phong cách pixel">
      <div className="pixel-stage__stars" aria-hidden="true" />
      <div className="pixel-stage__window" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="pixel-stage__screen" aria-hidden="true">
        <span className="pixel-stage__prompt">&gt; build ideas</span>
        <span className="pixel-stage__code">0101</span>
        <span className="pixel-stage__cursor" />
      </div>
      <div className="pixel-stage__desk" aria-hidden="true" />
      <div className="pixel-stage__pad" aria-hidden="true">
        <span className="pixel-stage__dpad">+</span>
        <span className="pixel-stage__button pixel-stage__button--a" />
        <span className="pixel-stage__button pixel-stage__button--b" />
      </div>
      <p className="pixel-stage__status"><span /> PLAYER_01 // ONLINE</p>
    </div>
  );
}
