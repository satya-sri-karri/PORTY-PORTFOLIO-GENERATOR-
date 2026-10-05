import { useState, useEffect } from 'react';
import './LineSidebar.css';

const LineSidebar = ({
  items = [],
  accentColor = '#53cade',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  maxShift = 30,
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.25,
  defaultActive = null,
  onItemClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => { setActiveIndex(defaultActive); }, [defaultActive]);

  return (
    <nav className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}`} style={{ paddingLeft: showMarker ? '4px' : '0' }}>
      <ul className="line-sidebar__list" style={{ gap: itemGap }}>
        {items.map((label, index) => {
          const isHovered = hoveredIndex === index;
          const isActive = activeIndex === index;
          return (
            <li
              key={index}
              className={`line-sidebar__item${isActive ? ' line-sidebar__item--active' : ''}${index < items.length - 1 ? ' line-sidebar__item--has-tick' : ''}`}
              style={{ '--marker-length': `${markerLength}px`, '--marker-gap': `${markerGap}px`, '--tick-scale': tickScale, '--item-gap': `${itemGap}px` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => { if (hoveredIndex === index) setHoveredIndex(null); }}

            >
              {showMarker && (
                <span className="line-sidebar__marker"
                  style={{
                    backgroundColor: isHovered || isActive ? accentColor : markerColor,
                    transform: `translateY(-50%) scaleX(${isHovered || isActive ? 1 : 0.7})`,
                  }}
                />
              )}
              {index < items.length - 1 && index < activeIndex && (
                <span className="line-sidebar__tick"
                  style={{
                    backgroundColor: markerColor,
                    width: `calc(${markerLength}px * ${tickScale})`,
                  }}
                />
              )}
              <button type="button" aria-current={isActive ? "step" : undefined} onClick={() => { setActiveIndex(index); onItemClick?.(index, label); }} className="line-sidebar__label"
                style={{
                  color: isHovered || isActive ? accentColor : textColor,
                  transform: `translateX(${isHovered || isActive ? maxShift : 0}px)`,
                  fontSize: `${fontSize}rem`,
                }}
              >
                {showIndex && (
                  <span className="line-sidebar__index"
                    style={{ opacity: isHovered || isActive ? 1 : 0.55 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default LineSidebar;
