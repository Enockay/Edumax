import AdmitStudent from './AdmitStudent';
import PayFees from './PayFess';
import ViewBalances from './ViewBalances';
import ShowStream from './ShowStream';
import AddStudent from './AddStudent';
import FilterStudent from './FilterStudent';
import SchoolAggregate from './SchoolAggregate';
import FeesReport from "./FeesReport";
import DeleteStudent from "./DeleteStudents "
import Results from './rankCompone';
import TeacherMarksForm from './updateStudentMarks';
import AddTeacher from './addTeacher';
import PromotionForm from './promoteStudent';
import GradeAlgorithm from './Algorithms';
import AssUnits from './AssigUnits';

const Body = ({selectedItem}) => {
    switch (selectedItem) {
        case 'admit-student':
            return <AdmitStudent />;
        case 'pay-fees':
            return <PayFees />;
        case 'view-balances':
            return <ViewBalances />;
        case 'Add-Teacher':
            return <AddTeacher/>;   
        case 'show-stream':
            return <ShowStream />;
        case 'add-student':
            return <AddStudent />;
        case 'filter-student':
            return <FilterStudent />;
        case 'school-aggregate':
            return <SchoolAggregate />;
        case 'update-student':
            return <DeleteStudent/>;
        case 'Fees-info':
            return <FeesReport/>
        case 'produce-results':
            return <Results/>
        case 'Teachers-Marks-Form':
            return <TeacherMarksForm/>
        case 'promote-stream':
            return <PromotionForm/>
        case 'algorithm':
            return <GradeAlgorithm/>
        case 'Assign-units' :
           return <AssUnits/>
        default:
            return <SchoolAggregate/>;
    }
}

export default Body