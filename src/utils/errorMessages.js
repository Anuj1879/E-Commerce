/* eslint-disable */
/**
 * @author Anuj Tomar
 * @description this file contain all error/success content and method response message
 */
module.exports = {
  errorGlobal: ['400', '401', '402', '403', '404', '408', '410', '415'],
  user: {
    id: 'id is required and must be integer',
    userId: 'Please provide Valid user Id',
    username: 'Please enter a valid Username',
    firstName: "Please enter first name",
    middleName: "Please enter middle name",
    lastName: "Please enter last name",
    productId: 'Please provide Valid product Id',
    productName: 'Please enter product name',
    price: 'Please enter price',
    onboardingStatus: 'Onboarding status should be 1 or 2',
    termAndCondition: 'Please accept term and condition.',
    orderId: 'Please provide Valid order Id',
    orderName: 'Please enter order name',
    position: "Please select position",
    from: "Please select valid from date(YYYY-MM-DD)",
    to: "Please select valid to date(YYYY-MM-DD)",
    company: "Please enter company name",
    doctorId: "Please select valid doctorId",
    qualification: "Please select qualification",
    school: "Please enter school/college name",
    grade: "Please enter grade/percentage",
    language: "please enter language and value should be unique",
    city: "please enter  city name",
    country: "please enter  country name",
    birthday: "please enter  your birth date(YYYY-MM-DD)",
    emailOrMobile: 'Please enter email or mobile',
    password: 'Please enter Valid Password',
    rePassword: 'Password and confirm password did not matched',
    emailId: 'Please Enter Valid Email ID',
    mobileNumber: 'Please Enter Correct Mobile',
    fullName: 'please enter Full Name',
    entityName: 'please enter entity name',
    entityType: 'please select entity Type',
    IndustryType: 'please select industry type',
    gstNumber: 'enter Valid GST Number',
    panNumber: 'enter Valid pan number',
    billingType: 'Please select Billing Type',
    userType: 'Please select user type should be mentor',
    address: 'enter address',
    pincode: 'Invalid pincode',
    city: 'enter city name',
    state: 'enter state name',
    status: 'Invalid status',
    country: 'enter country name',
    operation: 'Invalid Operation',
    transactionBy: 'Please insert transaction by name',
    description: 'Please enter desription',
    isActive: 'Please input User Status',
    existPassword: 'Password Cannot be the same as your current password',
    wrongPassword: 'Wrong Password',
    match: 'Password Matched',
    notFound: 'No Data Found',
    commonSuccess: 'Resource retrieved successfully',
    updateSuccess: "Request successfully updated",
    submitedDate: "Please valid Submit date",
    imageFor: 'Type is required and should be avatar or banner',
    otp: 'please enter vaild otp',
    serviceId: 'invalid service Id',
    sericeName: 'service name already exist',
    endTimeGreaterThanStartTime: 'The end-time must be greater than start time, and must be a valid date object',
    startTimeIsRequired: 'Start time is required!',
    dayMustBeValid: 'Day must be either Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday',
    mentorIdIsRequired: 'Mentor ID is required',
    menteeIdIsRequired: 'Mentee ID is required',
    serviceIdIsRequired: 'Service ID is required',
    statusMustBeValid: 'Status of a booking can either be Pending, Confirmed, Cancelled, Rescheduled',
    userNotFound: 'User not found',
    cantSendMoreMessages: 'You have exceeded the limit of maximum messages allowed for this month.',
    messageSendingFailed: 'Could not send message, something went wrong',
    sentMessageSuccessfully: 'Sent message succesfully',
    notificationIdIsRequired: 'Please enter notification id',
    bloodGroup: 'Please enter valid blood group',
    report: 'Please enter valid report info',
    clientAccount: 'Please enter valid client account',
    departmentType: 'Please enter valid department type',
  },
  toast: {
    alreadyExist: (value) => {
      return `${value} already exist!`;
    },
    emailNotVerified: (email) => {
      return `Please verify your email ${email}`;
    },
    available: (value) => {
      return `${value} is available`;
    },
    success: (value) => {
      return `${value} is successfully created.`;
    },
    varificationCodeSentToEmail: (email) => {
      return `Verification link sent to your email ${email}`;
    },
    varificationOTP: (mobile) => {
      return `Varification OTP sent to your mobile no. ${mobile}`;
    },
    invalidUser: 'Opps! Invalid email id',
    invalidUserId: 'Opps! Invalid user id',
    invalidPassword: 'Opps! Invalid password',
    invalidLink: `This link has been expired, please retry`,
    invaliEmail: 'Opps! Invalid email',
    expireToken: 'session timeout',
    loginSuccess: (value) => {
      return `${value} is successfully logged In.`;
    },
    invalidToken: 'Invalid token!',
    tokenRequired: 'token required.',
    passwordVerify: 'Password successfully verified',
    passwordChanged: 'Password successfully changed',
  },

  global: {
    searching: 'Invalid query searching',
    elle: 'Invalid query elle start and length is required',
    sorting: 'sorting should be object with the following promperties :- createdAt:-1  (for ascending), createdAt: 1, (for descending) ',
    start: 'start should be number.',
    length: 'length should be number. ',
    noRecord: 'No record found',
    commonSuccess: 'Resource retrieved successfully',
    reschedule: 'Booking rescheduled successfully',
    booking: 'Slot successfully Booked'
  },
};