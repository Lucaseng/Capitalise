import { useState, Dispatch } from "react";
import { Button, Grid, Stack, useTheme } from "@mui/material";
import { TContentBlock } from "../../model/TContentBlock";
import { ProjectContext } from "../../routes/ProjectPage";
import DeleteIcon from '@mui/icons-material/Delete';


interface ThumbnailProps {
    url: string
    tabIndex: number
    blockIndex: number
    imgIndex: number
    setImgUrls: Dispatch<React.SetStateAction<string[]>>
    imgUrls: string[]
}

export default function ImgThumbnail({ url, tabIndex, blockIndex, setImgUrls, imgUrls, imgIndex }: ThumbnailProps) {
    const [isHover, setIsHover] = useState(false)
    const theme = useTheme();

    const handleImgDelete = () => {
        const newUrls = [...imgUrls]
        newUrls.splice(imgUrls.indexOf(url), 1)
        setImgUrls(newUrls)
    }
  
    return (
      <Grid
        item
        xs={2}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleImgDelete}
      >
        <Button
          sx={{ 
            position: 'relative',
            '&:hover': {
            }
          }}
        >
          {isHover &&
            <Stack
              width={'100%'}
              height={'100%'}
              alignItems={'center'}
              justifyContent={'center'}
              sx={{
                backgroundColor: theme.customColors.DividerGrey,
                opacity: '70%',
                position: 'absolute'
              }}
            >
              <DeleteIcon fontSize='large' htmlColor='red'/>
            </Stack>
          }
          <img
            src={url}
            width='150px'
            height='150px'
            style={{
              objectFit: 'contain',
            }}
          />
        </Button>
      </Grid>
    )
  }