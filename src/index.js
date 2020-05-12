import ReactHabitat from 'react-habitat';
import AttendanceTrack from './components/attendanceTrack';
import Login from './components/login';

// Define an array of containers with the HTML ID's to attach to
const containers = [
    {
      id: "login",
      component: Login
    },
    {
        id: "tracking",
        component: AttendanceTrack
    }
  ];

  class App extends ReactHabitat.Bootstrapper {
    constructor() {
        super();

        // Create a new container builder:
        const builder = new ReactHabitat.ContainerBuilder();

        // Register container components
        for (let container of containers) {
            builder.register(container.component).as(container.id);
        }

        // Finally, set the container:
        this.setContainer(builder.build());
    }
}

export default new App();