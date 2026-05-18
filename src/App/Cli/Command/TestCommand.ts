import { Answer } from '@valkyrja/valkyrja/Cli/Interaction/Message/Answer.js';
import { Header } from '@valkyrja/valkyrja/Cli/Interaction/Message/Header.js';
import { Message } from '@valkyrja/valkyrja/Cli/Interaction/Message/Message.js';
import { NewLine } from '@valkyrja/valkyrja/Cli/Interaction/Message/NewLine.js';
import { Question } from '@valkyrja/valkyrja/Cli/Interaction/Message/Question.js';
import { Controller } from '../Controller/Abstract/Controller.js';

import type { CliConfigContract } from '@valkyrja/valkyrja/Application/Data/Contract/CliConfigContract.js';
import type { AnswerContract } from '@valkyrja/valkyrja/Cli/Interaction/Message/Contract/AnswerContract.js';
import type { MessageContract } from '@valkyrja/valkyrja/Cli/Interaction/Message/Contract/MessageContract.js';
import type { OutputContract } from '@valkyrja/valkyrja/Cli/Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '@valkyrja/valkyrja/Cli/Routing/Data/Contract/RouteContract.js';

export class TestCommand extends Controller {
    protected static readonly YES_ANSWER = 'yes';
    protected static readonly NO_ANSWER = 'no';

    static help(): MessageContract {
        return new Message('A command to showcase possibilities for commands.');
    }

    run(route: RouteContract, config: CliConfigContract): OutputContract {
        return this.outputFactory
            .createOutput()
            .withAddedMessages(new Header(config.namespace, config.version, route))
            .withAddedMessages(
                new NewLine(),
                new Question(
                    'This is a question, right?',
                    this.answered.bind(this),
                    new Answer(TestCommand.NO_ANSWER, null, false, 'You answered: `%s`', null, [
                        TestCommand.YES_ANSWER,
                        TestCommand.NO_ANSWER,
                    ]),
                ),
            );
    }

    answered(output: OutputContract, answer: AnswerContract): OutputContract {
        if (answer.getUserResponse() === TestCommand.YES_ANSWER) {
            return output
                .withAddedMessages(new Message('You answered yes!!!'), new NewLine(), new NewLine())
                .writeMessages();
        }

        return output.withAddedMessages(new NewLine());
    }
}
