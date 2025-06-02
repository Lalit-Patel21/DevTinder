# DevTinder APIs

## authRouter

- post /signup
- post /login
- post / logout

## profileRouter

- get/profile/view
- patch/profile/edit
- patch/profile/password

## connectionRequestRouter

- post/request/send/:staus/:userId
- post/request/review/:status/:requestId

- post/request/send/interested/:userId
- post/request/send/ignored/:userId
- post/request/review/accepeted/:requestId
- post/request/review/rejected/:requestId

## userRoter

GET /user/connections
GET /user/requests/received
GET /user/feed - gets you the profiles of other users on platform

status : ignore, interested, accepeted, rejected
