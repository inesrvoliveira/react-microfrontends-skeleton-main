import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text } from 'theme-ui';
import { CasesApi } from 'shared';
import { FilterSelect } from './FilterSelect';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const CaseListView = () => {
  const navigate = useNavigate();
  const { data: casesData, isLoading: casesLoading } =
    CasesApi.useGetCasesQuery();
  const { data: usersData, isLoading: usersLoading } =
    CasesApi.useGetUsersQuery();

  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [inactiveOnly, setInactiveOnly] = useState(false);

  const usersMap = useMemo(() => {
    if (!usersData) return {};
    return Object.fromEntries(usersData.map((u) => [u.identifier, u]));
  }, [usersData]);

  const filteredCases = useMemo(() => {
    if (!casesData?.cases) return [];
    return casesData.cases.filter((c) => {
      const matchesAssignee =
        !selectedAssigneeId || c.assignee_id === selectedAssigneeId;
      const matchesStatus = !selectedStatus || c.status === selectedStatus;
      const user = usersMap[c.assignee_id];
      const matchesInactive = !inactiveOnly || (user && !user.active);
      return matchesAssignee && matchesStatus && matchesInactive;
    });
  }, [casesData, selectedAssigneeId, selectedStatus, inactiveOnly, usersMap]);

  const hasActiveFilters = Boolean(
    selectedAssigneeId || selectedStatus || inactiveOnly,
  );

  const clearFilters = () => {
    setSelectedAssigneeId('');
    setSelectedStatus('');
    setInactiveOnly(false);
  };

  // ---- Loading state -------------------------------------------------------
  if (casesLoading || usersLoading) {
    return (
      <Box>
        <Heading
          as="h1"
          sx={{
            fontSize: 'font-size-xl',
            fontWeight: 'font-weight-bold',
            mb: 'spacing-md',
          }}
        >
          Cases
        </Heading>
        <Text sx={{ color: 'textMuted' }}>Loading cases…</Text>
      </Box>
    );
  }

  // ---- Loaded state --------------------------------------------------------
  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'spacing-sm',
          mb: 'spacing-lg',
        }}
      >
        <Heading
          as="h1"
          sx={{
            fontSize: 'font-size-xl',
            fontWeight: 'font-weight-bold',
            m: 0,
          }}
        >
          Cases
        </Heading>
        <Box
          as="span"
          sx={{
            fontSize: 'font-size-md',
            color: 'textMuted',
            bg: 'bgPanel',
            px: 'spacing-sm',
            py: 'spacing-3xs',
            borderRadius: 'radius-full',
          }}
        >
          {filteredCases.length}
          {hasActiveFilters ? ` of ${casesData?.cases.length}` : ''} cases
        </Box>
      </Box>
      {/* Filter bar */}
      <Box
        sx={{
          mb: 'spacing-lg',
          bg: 'white',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-xs',
          border: '1px solid',
          borderColor: 'borderLight',
        }}
      >
        {/* Filter bar header — subtle section label */}
        <Box
          sx={{
            px: 'spacing-md',
            pt: 'spacing-xs',
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
            Filters
          </Text>
        </Box>
        {/* Filter controls */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 'spacing-md',
            p: 'spacing-md',
          }}
        >
          <FilterSelect
            id="status-filter"
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="All statuses"
            options={Object.entries(STATUS_LABELS).map(([key, label]) => ({
              value: key,
              label,
            }))}
          />

          <FilterSelect
            id="assignee-filter"
            label="Assignee"
            value={selectedAssigneeId}
            onChange={setSelectedAssigneeId}
            placeholder="All assignees"
            options={
              usersData?.map((user) => ({
                value: user.identifier,
                label: user.name,
              })) ?? []
            }
          />

          {/* Inactive assignees toggle */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 'spacing-xs' }}
          >
            <Box
              as="span"
              sx={{
                fontSize: '11px',
                fontWeight: 'font-weight-bold',
                color: 'textMuted',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Inactive assignees
            </Box>
            <Box
              as="button"
              role="switch"
              aria-checked={inactiveOnly}
              aria-label="Inactive assignees only"
              onClick={() => setInactiveOnly((v) => !v)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'spacing-sm',
                height: 'input-height',
                px: 0,
                border: 'none',
                borderRadius: 0,
                bg: 'transparent',
                color: inactiveOnly ? 'textNegative' : 'textMuted',
                fontSize: 'font-size-md',
                fontWeight: inactiveOnly
                  ? 'font-weight-semi-bold'
                  : 'font-weight-normal',
                fontFamily: 'body',
                cursor: 'pointer',
                transition: 'color 150ms ease',
                whiteSpace: 'nowrap',
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              {/* Visual toggle pill */}
              <Box
                sx={{
                  width: '32px',
                  height: '18px',
                  borderRadius: 'radius-full',
                  bg: inactiveOnly ? 'negative500' : 'neutral300',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background-color 150ms ease',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '2px',
                    left: inactiveOnly ? '16px' : '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: 'radius-full',
                    bg: 'white',
                    transition: 'left 150ms ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </Box>
              Show only inactive
            </Box>
          </Box>

          {/* Clear filters */}
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            sx={{
              alignSelf: 'flex-end',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'spacing-xs',
              height: 'input-height',
              px: 'spacing-md',
              borderRadius: 'radius-full',
              border: '1.5px solid',
              borderColor: hasActiveFilters ? 'accent400' : 'borderLight',
              bg: hasActiveFilters ? 'accent50' : 'bgPanel',
              color: hasActiveFilters ? 'accent600' : 'textDisabled',
              fontSize: 'font-size-md',
              fontWeight: 'font-weight-semi-bold',
              fontFamily: 'body',
              cursor: hasActiveFilters ? 'pointer' : 'default',
              transition: 'all 150ms ease',
              '&:hover:not(:disabled)': {
                bg: 'accent100',
                borderColor: 'accent500',
              },
              '&:active:not(:disabled)': {
                bg: 'accent200',
              },
            }}
          >
            {/* × icon */}
            <Box as="span" sx={{ fontSize: '16px', lineHeight: 1 }}>
              ×
            </Box>
            Clear filters
          </button>
        </Box>{' '}
        {/* end filter controls */}
      </Box>{' '}
      {/* end filter card */}
      {/* Cases table */}
      <Box
        sx={{
          bg: 'white',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-xs',
          border: '1px solid',
          borderColor: 'borderLight',
          overflow: 'hidden',
        }}
      >
        <Box as="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <Box as="thead">
            <Box as="tr" sx={{ bg: 'bgPanel' }}>
              {['Case Name', 'Status', 'Assignee'].map((col) => (
                <Box
                  as="th"
                  key={col}
                  sx={{
                    textAlign: 'left',
                    px: 'spacing-md',
                    py: 'spacing-sm',
                    fontSize: 'font-size-md',
                    fontWeight: 'font-weight-semi-bold',
                    color: 'textSubtle',
                    borderBottom: '2px solid',
                    borderColor: 'borderLight',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </Box>
              ))}
            </Box>
          </Box>

          <Box as="tbody">
            {filteredCases.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: '48px 16px',
                    textAlign: 'center',
                    color: '#838991',
                  }}
                >
                  No cases match your filters.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => {
                const user = usersMap[c.assignee_id];
                const statusColors = STATUS_COLORS[c.status] ?? {
                  bg: 'bgPanel',
                  color: 'textSubtle',
                };
                return (
                  <Box
                    as="tr"
                    key={c.identifier}
                    onClick={() => navigate(`/cases/${c.identifier}`)}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: 'borderLight',
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bg: 'bgSelected' },
                      transition: 'background-color 150ms ease',
                    }}
                  >
                    {/* Case name */}
                    <Box
                      as="td"
                      sx={{
                        px: 'spacing-md',
                        py: 'spacing-md',
                        fontWeight: 'font-weight-semi-bold',
                        color: 'textBase',
                        maxWidth: '340px',
                      }}
                    >
                      {c.name}
                    </Box>

                    {/* Status badge */}
                    <Box
                      as="td"
                      sx={{
                        px: 'spacing-md',
                        py: 'spacing-md',
                        whiteSpace: 'nowrap',
                      }}
                    >
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
                        {STATUS_LABELS[c.status] ?? c.status}
                      </Box>
                    </Box>

                    {/* Assignee */}
                    <Box as="td" sx={{ px: 'spacing-md', py: 'spacing-md' }}>
                      {user ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'spacing-xs',
                          }}
                        >
                          {/* Avatar circle */}
                          <Box
                            as="span"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: 'radius-full',
                              bg: user.active ? 'accent200' : 'neutral200',
                              color: user.active ? 'accent800' : 'neutral700',
                              fontSize: '11px',
                              fontWeight: 'font-weight-bold',
                              flexShrink: 0,
                            }}
                          >
                            {user.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </Box>
                          <Text sx={{ fontSize: 'font-size-md' }}>
                            {user.name}
                          </Text>
                          {!user.active && (
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
                        <Text
                          sx={{ color: 'textMuted', fontSize: 'font-size-md' }}
                        >
                          —
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
