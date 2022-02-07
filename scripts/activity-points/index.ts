import initServices from '../../server/initialize-services';
import { addActivityPoints } from './activity-points';


async function activityPoints() {
  try {
    //Connect to pg db
    await initServices();
    //Function to add activity points
    await addActivityPoints();

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}
activityPoints();
