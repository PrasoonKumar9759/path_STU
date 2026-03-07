@Service
public class AdaptiveSchedulerService {

    public List<String> createSchedule(List<String> topics){

        List<String> schedule = new ArrayList<>();

        for(String topic : topics){

            schedule.add("Study " + topic);
            schedule.add("Practice " + topic);
        }

        return schedule;
    }
}