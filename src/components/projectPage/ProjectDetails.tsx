import React, { SetStateAction, useContext } from 'react'
import { Box, Stack, Typography, useTheme, Chip } from '@mui/material'


import TeamnameField from './Fields/TeamnameField'
import CategoryField from './Fields/CategoryField'
import SemesterField from './Fields/SemesterField'
import MembersField from './Fields/MembersField'
import GithubBtn from './GithubBtn'
import CodeSandboxBtn from './CodeSandbox'
import AwardBadge from './AwardBadge'
import { ProjectContext } from './ProjectPage'




export default function ProjectDetails() {

  const theme = useTheme()
  const { project, setProjectChanges } = useContext(ProjectContext);

  return (
    <Stack
      maxWidth={'30%'}
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'20px'}
      gap={1}
      sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative' }}
    >
      {/* <StatusChip label='Status:' status='Pending Approval' /> */}

      {project.badges && <AwardBadge {...project.badges} />}
      <CategoryField />
      <SemesterField />
      <TeamnameField />
      <MembersField />
      <Box mt={1}>
        <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Links:</Typography>
        <GithubBtn />
        <CodeSandboxBtn />
      </Box>

      <Stack mt={8} flexDirection={'row'} gap={1} flexWrap={'wrap'}>
        {project.tags.map( (tag, i) => (
          <Chip key={i} size='small' label={tag.name} />
        ))}
      </Stack>
    </Stack>

  )
}
