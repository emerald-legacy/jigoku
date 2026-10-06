import { blank } from '../../../effects.js';
import {
    attach,
    cardLastingEffect,
    deckSearch,
    discardFromPlay,
    ifAble,
    moveStatusToken,
    placeFate,
    putIntoConflict,
    putIntoPlay,
    returnToDeck,
    sequential
} from '../../../GameActions/GameActions.js';
import { Decks, Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export function makeTwin(id: string, opt: { siblingName: string; title: string; effect: string }) {
    return class Twin extends DrawCard {
        static id = id;

        setupCardAbilities() {
            this.action(opt.title)
                .gameAction(deckSearch({
                    cardCondition: (card) => card.name === opt.siblingName,
                    deck: Decks.DynastyDeck,
                    shuffle: false,
                    activePromptTitle: `Find a copy of ${opt.siblingName}`,
                    selectedCardsHandler: (context, event, cards) => {
                        if(cards.length === 0) {
                            context.game.addMessage(`{0} finds no copies of ${opt.siblingName}`, event.player);
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

                        context.game.addMessage(
                            '{0} replaces {1} with {2}',
                            event.player,
                            replacedCharacter,
                            newCharacter
                        );
                    }
                }))
                .effect(opt.effect);
        }
    };
}
