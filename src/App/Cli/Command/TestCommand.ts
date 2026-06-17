/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Answer } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Answer.js';
import { Header } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Header.js';
import { Message } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Message.js';
import { NewLine } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/NewLine.js';
import { Question } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Question.js';
import { Controller } from '../Controller/Abstract/Controller.js';

import type { CliConfigContract } from '@valkyrjaio/valkyrja/Application/Data/Contract/CliConfigContract.js';
import type { AnswerContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Contract/AnswerContract.js';
import type { MessageContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Contract/MessageContract.js';
import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Contract/RouteContract.js';

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
