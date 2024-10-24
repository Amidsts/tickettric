import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@amidsttickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
