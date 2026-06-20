import { Container, Paper, Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container sx={{ my: 2 }}>
      <Stack spacing={1} sx={{ maxWidth: 600, mx: "auto" }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant={"h5"} gutterBottom>
            About Us
          </Typography>
          <Typography paragraph>
            Anywhere Fitness is an fitness company dedicated to tackling the issue of healthy living around the world
            with the use of technology. Anywhere fitness aims to empowers individuals the ability to track their
            progress and connect with individuals to work towards an healthier lifestyle.
          </Typography>
          <Typography variant={"h6"} gutterBottom>
            Our History
          </Typography>
          <Typography paragraph>
            Anywhere Fitness was founded back in 2018, started by our founder, Mr Ong Lai Huat together with his
            friends, Kok Eng Song and Kin Lian Tan. The company was funded by the Aiwolres Pontomorow Association with
            generous resources used to develop the web app. Anywhere Fitness was greatly impacted back in the COVID-19
            period where people went out less which led to a steep decrease in usage. Currently Anywhere Fitness is one
            of the most used app that every user use
          </Typography>
          <Typography paragraph>
            Anywhere Fitness is a fitness company launched back in 2018 with a mission to use technology to promote a
            healthy lifestyle worldwide. The company was founded by Mr Ong Lai Huat and his friends Kok Eng Song and Kin
            Lian Tan. Funding was obtained from the Aivolres Pontomoro Association, which provided generous amount of
            resources for the development of this web application
          </Typography>
          <Typography variant={"h6"} gutterBottom>
            Our Mission
          </Typography>
          <Typography paragraph>
            The primary mission of Anytime Fitness is to empower individuals with the ability to track their own
            progress and find like-minded people to help one another reach towards a common fitness goal.
          </Typography>
          <Typography variant={"h6"} gutterBottom>
            Our Challenges
          </Typography>
          <Typography paragraph>
            Back in 2019, the company faced an early block to its development due to the COVID-19 pandemic. The company
            notice a steep decline of its user due to tighter restrictions from going out. However with strong
            perseverance the company was able to overcome its first major obstacle and continue on its mission to ensure
            individuals pursue a healthly lifestyle.
          </Typography>
          <Typography variant={"h6"} gutterBottom>
            Now
          </Typography>
          <Typography paragraph>
            Currently, Anywhere Fitness stands as one of the most used and proffered fitness apps in the industry. The
            app has various user preach of its success in helping them achieve their fitness goals and reaching an
            healthier lifestyle. Anywhere Fitness with this, is inspired to continue and work towards a future where
            many more individuals can achieve their fitness goals and lead a healthier lifestyle
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2 }}>
          <Typography variant={"h5"} gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography paragraph>
            <Typography variant={"h6"} paragraph>
              1. Is our app free?
            </Typography>
            <Typography paragraph>Yes, our app is free to use!</Typography>
            <Typography variant={"h6"} paragraph>
              2. Does this app access my home Wi-Fi?
            </Typography>
            <Typography paragraph>
              Only if the users turn on the Wi-Fi... Sorry I didn&apos;t understand your question. (ref. Shou Zi Chew)
            </Typography>
            <Typography variant={"h6"} paragraph>
              3. Does this app access other devices on the home Wi-Fi network?
            </Typography>
            <Typography paragraph>We don&apos;t do anything that is beyond industry norms.</Typography>
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2 }}>
          <Typography variant={"h5"} gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            Buangkok Green Medical Park <br />
            10 Buangkok View <br />
            Singapore 539747
          </Typography>
          <Typography paragraph>Tel: 6389 2000</Typography>
          <Typography paragraph>Email: imh_appt@imh.com.sg</Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
