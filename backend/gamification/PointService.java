@Service
public class PointsService {

    public int givePoints(boolean taskCompleted){

        if(taskCompleted){
            return 10;
        }

        return 0;
    }
}