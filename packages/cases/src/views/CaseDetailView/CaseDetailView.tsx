import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text } from 'theme-ui';
import { CasesApi } from 'shared';

const STATUS_LABELS: Record<string, string> = {
  CASE_NOT_STARTED: 'Not Started',
  CASE_IN_PROGRESS: 'In Progress',
  CASE_ON_HOLD: 'On Hold',
  CASE_RESOLVED_RISK_DETECTED: 'Resolved – Risk Detected',
  CASE_RESOLVED_NO_RISK_DETECTED: 'Resolved – No Risk Detected',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  CASE_NOT_STARTED: { bg: 'neutral100', color: 'textSubtle' },
  CASE_IN_PROGRESS: { bg: 'accent50', color: 'accent600' },
  CASE_ON_HOLD: { bg: 'brand100', color: 'neutral900' },
  CASE_RESOLVED_RISK_DETECTED: { bg: 'bgNegative', color: 'textNegative' },
  CASE_RESOLVED_NO_RISK_DETECTED: { bg: 'bgPositive', color: 'textPositive' },
};

/** Thin labelled row used inside the detail card */
const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <>
    <Text
      sx={{
        fontSize: '11px',
        fontWeight: 'font-weight-bold',
        color: 'textMuted',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        pt: 'spacing-2xs',
      }}
    >
      {label}
    </Text>
    <Box sx={{ fontSize: 'font-size-md', color: 'textBase' }}>{children}</Box>
  </>
);

export const CaseDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: casesData, isLoading: casesLoading } =
    CasesApi.useGetCasesQuery();
  const { data: usersData, isLoading: usersLoading } =
    CasesApi.useGetUsersQuery();

  const caseItem = useMemo(
    () => casesData?.cases.find((c) => c.identifier === id),
    [casesData, id],
  );

  const assignee = useMemo(
    () => usersData?.find((u) => u.identifier === caseItem?.assignee_id),
    [usersData, caseItem],
  );

  if (casesLoading || usersLoading) {
    return <Text sx={{ color: 'textMuted' }}>Loading…</Text>;
  }

  if (!caseItem) {
    return (
      <Box>
        <Text sx={{ color: 'textMuted', mb: 'spacing-md' }}>
          Case not found.
        </Text>
        <Box
          as="button"
          onClick={() => navigate('/cases')}
          sx={{
            background: 'none',
            border: 'none',
            color: 'textLink',
            fontSize: 'font-size-md',
            cursor: 'pointer',
            p: 0,
            textDecoration: 'underline',
          }}
        >
          Back to Cases
        </Box>
      </Box>
    );
  }

  const statusColors = STATUS_COLORS[caseItem.status] ?? {
    bg: 'bgPanel',
    color: 'textSubtle',
  };

  return (
    <Box>
      {/* Back button */}
      <Box
        as="button"
        onClick={() => navigate('/cases')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'spacing-xs',
          mb: 'spacing-lg',
          px: 'spacing-sm',
          py: 'spacing-xs',
          bg: 'white',
          border: '1.5px solid',
          borderColor: 'borderLight',
          borderRadius: 'radius-full',
          color: 'textSubtle',
          fontSize: 'font-size-md',
          fontFamily: 'body',
          fontWeight: 'font-weight-semi-bold',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          boxShadow: 'shadow-xs',
          '&:hover': {
            borderColor: 'inputBorderHover',
            color: 'textBase',
            boxShadow: 'shadow-sm',
          },
          '&:active': {
            bg: 'bgPanel',
          },
          '&:focus': {
            outline: 'none',
            borderColor: 'accent500',
            boxShadow: '0 0 0 3px rgba(101,134,176,0.18)',
          },
        }}
      >
        {/* Left arrow icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Cases
      </Box>

      {/* Page header */}
      <Box sx={{ mb: 'spacing-lg' }}>
        <Heading
          as="h1"
          sx={{
            fontSize: 'font-size-xl',
            fontWeight: 'font-weight-bold',
            m: 0,
          }}
        >
          {caseItem.name}
        </Heading>
      </Box>

      {/* Detail card */}
      <Box
        sx={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'borderLight',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-xs',
          overflow: 'hidden',
        }}
      >
        {/* Card header bar */}
        <Box
          sx={{
            px: 'spacing-md',
            py: 'spacing-xs',
            borderBottom: '1px solid',
            borderColor: 'borderLight',
            bg: 'bgPanel',
          }}
        >
          <Text
            sx={{
              fontSize: '11px',
              fontWeight: 'font-weight-bold',
              color: 'neutral400',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Case details
          </Text>
        </Box>

        {/* Detail rows */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            gap: 'spacing-md',
            p: 'spacing-lg',
          }}
        >
          <DetailRow label="Case ID">
            <Text
              sx={{
                fontFamily: 'monospace',
                fontSize: '13px',
                color: 'textSubtle',
                wordBreak: 'break-all',
              }}
            >
              {caseItem.identifier}
            </Text>
          </DetailRow>

          <DetailRow label="Status">
            <Box
              as="span"
              sx={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 'font-weight-semi-bold',
                px: 'spacing-sm',
                py: 'spacing-3xs',
                borderRadius: 'radius-full',
                bg: statusColors.bg,
                color: statusColors.color,
              }}
            >
              {STATUS_LABELS[caseItem.status] ?? caseItem.status}
            </Box>
          </DetailRow>

          <DetailRow label="Assignee">
            {assignee ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'spacing-xs',
                }}
              >
                {/* Avatar */}
                <Box
                  as="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'radius-full',
                    bg: assignee.active ? 'accent200' : 'neutral200',
                    color: assignee.active ? 'accent800' : 'neutral700',
                    fontSize: '11px',
                    fontWeight: 'font-weight-bold',
                    flexShrink: 0,
                  }}
                >
                  {assignee.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </Box>
                <Text sx={{ fontSize: 'font-size-md' }}>{assignee.name}</Text>
                {!assignee.active && (
                  <Box
                    as="span"
                    sx={{
                      fontSize: '11px',
                      px: 'spacing-xs',
                      py: 'spacing-3xs',
                      bg: 'bgNegative',
                      color: 'textNegative',
                      borderRadius: 'radius-full',
                      fontWeight: 'font-weight-semi-bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Inactive
                  </Box>
                )}
              </Box>
            ) : (
              <Text sx={{ color: 'textMuted' }}>—</Text>
            )}
          </DetailRow>
        </Box>
      </Box>
    </Box>
  );
};
