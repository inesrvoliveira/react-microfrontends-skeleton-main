import { useState, useRef, useEffect, useId } from 'react';
import { Box, Label, Text } from 'theme-ui';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DropdownOption {
  value: string;
  label: string;
}

// ---------------------------------------------------------------------------
// ChevronDown icon
// ---------------------------------------------------------------------------

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      pointerEvents: 'none',
      flexShrink: 0,
      transition: 'transform 150ms ease',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ---------------------------------------------------------------------------
// FilterSelect
// ---------------------------------------------------------------------------

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  placeholder: string;
}

/**
 * A fully custom combobox/listbox dropdown that always opens below the
 * trigger regardless of scroll position. Supports full keyboard navigation
 * (Enter/Space to open, ArrowUp/Down to navigate, Escape to close) and
 * closes on outside click.
 */
export const FilterSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: FilterSelectProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((o) => !o);
      return;
    }
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = options[(idx + 1) % options.length];
      onChange(next.value);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = options[(idx - 1 + options.length) % options.length];
      onChange(prev.value);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'spacing-xs',
        minWidth: '220px',
        position: 'relative',
      }}
    >
      <Label
        htmlFor={id}
        sx={{
          fontSize: '11px',
          fontWeight: 'font-weight-bold',
          color: 'textMuted',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: 'pointer',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </Label>

      {/* Trigger */}
      <Box
        id={id}
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bg: 'white',
          border: '1.5px solid',
          borderColor: value ? 'accent400' : open ? 'accent500' : 'inputBorder',
          borderRadius: 'input-radius',
          height: 'input-height',
          px: 'spacing-sm',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          boxShadow: open ? '0 0 0 3px rgba(101,134,176,0.18)' : 'none',
          '&:focus': {
            outline: 'none',
            borderColor: 'accent500',
            boxShadow: '0 0 0 3px rgba(101,134,176,0.18)',
          },
          '&:hover': {
            borderColor: value ? 'accent500' : 'inputBorderHover',
          },
        }}
      >
        <Text
          sx={{
            fontSize: 'font-size-md',
            color: value ? 'textBase' : 'textMuted',
            fontWeight: value ? 'font-weight-semi-bold' : 'font-weight-normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {selectedLabel}
        </Text>
        <Box
          sx={{
            color: value ? 'accent500' : 'textMuted',
            ml: 'spacing-xs',
            display: 'flex',
          }}
        >
          <ChevronDown open={open} />
        </Box>
      </Box>

      {/* Listbox — anchored below trigger via position:absolute + top:100% */}
      {open && (
        <Box
          id={listboxId}
          role="listbox"
          aria-label={label}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 'inputModal',
            bg: 'white',
            border: '1.5px solid',
            borderColor: 'accent400',
            borderRadius: 'radius-md',
            boxShadow: 'shadow-sm',
            maxHeight: '260px',
            overflowY: 'auto',
            py: 'spacing-xs',
          }}
        >
          {/* "All" / placeholder option */}
          <Box
            role="option"
            aria-selected={value === ''}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            sx={{
              px: 'spacing-sm',
              py: 'spacing-xs',
              fontSize: 'font-size-md',
              color: value === '' ? 'accent600' : 'textMuted',
              fontStyle: 'italic',
              cursor: 'pointer',
              bg: value === '' ? 'accent50' : 'transparent',
              '&:hover': { bg: 'bgSelected' },
            }}
          >
            {placeholder}
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              bg: 'borderLight',
              mx: 'spacing-xs',
              my: 'spacing-xs',
            }}
          />

          {options.map((opt) => (
            <Box
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              sx={{
                px: 'spacing-sm',
                py: 'spacing-xs',
                fontSize: 'font-size-md',
                color: value === opt.value ? 'accent600' : 'textBase',
                fontWeight:
                  value === opt.value
                    ? 'font-weight-semi-bold'
                    : 'font-weight-normal',
                cursor: 'pointer',
                bg: value === opt.value ? 'accent50' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': { bg: 'bgSelected' },
              }}
            >
              {opt.label}
              {value === opt.value && (
                <Box as="span" sx={{ color: 'accent500', fontSize: '14px' }}>
                  ✓
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
