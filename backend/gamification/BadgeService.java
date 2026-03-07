@Service
public class BadgeService {

    public String checkBadge(int completedTasks){

        if(completedTasks >= 50)
            return "Master Learner";

        if(completedTasks >= 20)
            return "Intermediate";

        if(completedTasks >= 10)
            return "Beginner";

        return "No Badge";
    }
}