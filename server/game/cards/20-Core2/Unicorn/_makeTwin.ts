import { msg } from '../../../GameChat.js';
import { blank } from '../../../effects.js';
import {
    attach,
    cardLastingEffect,
    discardFromPlay,
    ifAble,
    moveStatusToken,
    placeFate,
    putIntoConflict,
    putIntoPlay,
    returnToDeck,
    sequential
} from '../../../GameActions/GameActions.js';
import { DeckType, Duration, RemainingCards } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export function makeTwin(id: string, opt: { siblingName: string; title: string; chatText: string }) {
    return class Twin extends DrawCard {
        static id = id;

        setupCardAbilities() {
            this.action(opt.title)
                .deckSearch({
                    cardCondition: (card) => card.name === opt.siblingName,
                    deck: DeckType.Dynasty,
                    remainingCards: RemainingCards.Top,
                    activePromptTitle: `Find a copy of ${opt.siblingName}`,
                    selectedCardsHandler: (context, event, cards) => {
                        if(cards.length === 0) {
                            context.game.addMessage(msg`${event.player} finds no copies of ${opt.siblingName}`);
                            return;
                        }

                        const newCharacter = cards[0];
                        const replacedCharacter = context.source;
                        if(!replacedCharacter.isDrawCard()) {
                            return;
                        }
                        const intoPlayAction = replacedCharacter.isParticipating()
                            ? putIntoConflict({ target: newCharacter })
                            : putIntoPlay({ target: newCharacter });
                        intoPlayAction.resolve(newCharacter, context);

                        const sequence: GameAction[] = replacedCharacter.attachments.map((attachment) =>
                            ifAble({
                                ifAbleAction: attach({ attachment, target: newCharacter }),
                                otherwiseAction: discardFromPlay({ target: attachment })
                            })
                        );
                        sequence.push(
                            placeFate({
                                target: newCharacter,
                                origin: replacedCharacter,
                                amount: replacedCharacter.fate
                            })
                        );
                        for(const token of replacedCharacter.statusTokens) {
                            sequence.push(
                                moveStatusToken({ target: token, recipient: newCharacter })
                            );
                        }
                        sequential(sequence).resolve(newCharacter, context);

                        cardLastingEffect({
                            effect: blank(),
                            duration: Duration.UntilEndOfRound,
                            target: newCharacter
                        })
                            .resolve(newCharacter, context);

                        returnToDeck({ target: replacedCharacter, shuffle: true })
                            .resolve(replacedCharacter, context);

                        context.game.addMessage(msg`${event.player} replaces ${replacedCharacter} with ${newCharacter}`);
                    }
                })
                .chatText(opt.chatText);
        }
    };
}
