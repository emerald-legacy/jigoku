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
import { DeckType, Duration, Location, RemainingCards } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

function intoPlay(character: DrawCard) {
    return character.isParticipating() ? putIntoConflict() : putIntoPlay();
}

export function makeTwin(id: string, opt: { siblingName: string; title: string; chatText: string }) {
    return class Twin extends DrawCard {
        static id = id;

        override setupCardAbilities() {
            this.action(opt.title)
                .deckSearch({
                    cardCondition: (card, context) => card.name === opt.siblingName && intoPlay(context.source).canAffect(card, context),
                    deck: DeckType.Dynasty,
                    remainingCards: RemainingCards.Top,
                    activePromptTitle: `Find a copy of ${opt.siblingName}`,
                    selectedCardsHandler: (context, event, cards) => {
                        if(cards.length === 0) {
                            context.game.addMessage(msg`${event.player} finds no copies of ${opt.siblingName}`);
                            // RRG Search: a searched deck is shuffled
                            event.player.shuffleDynastyDeck();
                            return;
                        }

                        const newCharacter = cards[0];
                        const replacedCharacter = context.source;
                        if(!replacedCharacter.isDrawCard()) {
                            return;
                        }
                        intoPlay(replacedCharacter).resolve(newCharacter, context);
                        context.game.queueSimpleStep(() => {
                            if(newCharacter.location !== Location.PlayArea) {
                                return;
                            }
                            this.replace(context, replacedCharacter, newCharacter);
                            context.game.addMessage(msg`${event.player} replaces ${replacedCharacter} with ${newCharacter}`);
                        });
                    }
                })
                .chatText(opt.chatText);
        }

        private replace(context: AbilityContext, replacedCharacter: DrawCard, newCharacter: DrawCard): void {
            const sequence: GameAction[] = replacedCharacter.attachments.map((attachment) =>
                ifAble({
                    ifAbleGameAction: attach({ attachment, target: newCharacter }),
                    otherwiseGameAction: discardFromPlay({ target: attachment })
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
        }
    };
}
