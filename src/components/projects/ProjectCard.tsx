import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import communityImpact from "../../assets/communityImpact.svg";
import peoplesChoice from "../../assets/peoplesChoice.svg";
import topExcellence from "../../assets/topExcellence.svg";

import DefaultProjectImage from "../../assets/DefaultProjectImage.svg";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  semester: string;
  image: string;
  teamname: string;
  category: string;
  likes: number;
  badges: string;
  projectID: string;
}

const ProjectCard = ({
  title,
  semester,
  image,
  teamname,
  category,
  likes,
  badges,
  projectID,
}: Props) => {
  const handleDefaultImage = (e: any) => {
    e.target.onerror = null;
    e.target.src = DefaultProjectImage;
  };
  const theme = useTheme();

  // Yathi - Have to properly define type or build fails.
  let colour: (typeof theme)["customColors"] | string = "lightgrey";

  let awardText = "";
  let awardIcon = null;

  const setBadge = (badges: string) => {
    if (badges === "Community Impact") {
      colour = theme.customColors.communityImpact!;
      awardText = "Community Impact Award";
      awardIcon = communityImpact;
    } else if (badges === "Top Excellence") {
      colour = theme.customColors.excellenceAward!;
      awardText = "Top Excellence Award";
      awardIcon = topExcellence;
    } else if (badges === "Peoples Choice") {
      colour = theme.customColors.peoplesChoice!;
      awardText = "People's Choice Award";
      awardIcon = peoplesChoice;
    }
  };

  setBadge(badges);

  return (
    <Card
      sx={{
        minWidth: 320,
        maxWidth: 320,
        border: "none",
        ":hover": {
          boxShadow: 10,
        },
      }}
    >
      <CardActionArea component={Link} to={`../projects/${projectID}`}>
        <CardMedia
          component="img"
          alt="error loading image"
          height="125px"
          src={image}
          onError={handleDefaultImage}
        />
        <Box bgcolor={colour} height="8px" />

        <CardContent
          sx={{
            paddingTop: "15px",
            paddingBottom: "13px",
            "&:last-child": {
              paddingTop: "15px",
              paddingBottom: "13px",
            },
          }}
        >
          <Box display="flex">
            {awardIcon && (
              <Box paddingRight="10px">
                <img src={awardIcon}></img>
              </Box>
            )}
            <Box display="grid">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 0.4, fontSize: "10px" }}
              >
                {semester}
              </Typography>
              <Typography noWrap variant="h5" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography
                variant="body2"
                marginBottom="1.5em"
                height="4px"
                sx={{ lineHeight: 0.4, fontSize: "10px", color: colour }}
              >
                {awardText}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="end">
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.5}
                fontSize="12px"
              >
                {teamname}
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                lineHeight={1}
                fontSize="12px"
              >
                {category}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="end"
              gap="2px"
              paddingBottom="0.35em"
            >
              <FavoriteIcon
                sx={{ color: theme.customColors.likes }}
                fontSize="small"
              />
              <Typography
                variant="body2"
                color={theme.customColors.likes}
                fontSize="1.25em"
                lineHeight={1}
              >
                {likes}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;