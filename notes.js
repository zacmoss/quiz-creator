/*

Need to handle if they type same teacher at same school types in same name of
an existing quiz we need to send error telling her that that quiz already exists.

Build 'CreatedQuiz' component which shows a submitted quiz fully, with edit 
buttons on each question that sends us to QuestionComponent with 'edit' variable 
passed. Could store some kind of 'edit mode' variable on the server which is 
made 'edit mode' when they click on a submitted quiz from the dashboard and made
'init mode' when they click 'create quiz' from the dashboard. Needs to be nulled
when we return to dashboard....on load of dashboard...


Need to build the Question Component where it capable of editing an initialized
question like when they first create a quiz as well as an editable question
when they go edit a quiz. So, in the component we need to be able to plug in data
from the server which fills in the inputs (clear if initialized). And then, be
able to alter the answers, type, etc and be able to save question. On click next,
we need some kind of variable the was passed deciding if this is an intialized
question or edited question so that next click either renders the next question
or returns them to view the already submitted quiz...Or we could have that 'edit
mode' variable stored on the server which is called for on load of this component
and determines the render...

Have a singular DashboardComponent that on componentWillRender hits server where
there is a variable stored 'teacher user' or 'student user' and conditional renders
depending on that variable.

Make a video showing the user experience of this site. Post to your portfolio and
LWF portfolio.



Teacher User

TeacherDashboard
(*) CreateQuizPage
(*) QuestionComponent (Init)
EditQuizPage
QuestionComponent (Edit)



Student User

StudentDashboard (TakeQuiz) (QuizResults)
TakeQuizPage
QuestionComponent
ResultsPage





*/