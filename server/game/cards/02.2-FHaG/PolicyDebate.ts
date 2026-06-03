import { CardType, DuelType, Players } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class PolicyDebate extends DrawCard {
    static id = 'policy-debate';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.duel((context) => ({
                        type: DuelType.Political,
                        challenger: context.targets.challenger,
                        message: '{0} sees {1}\'s hand and chooses a card to discard',
                        messageArgs: (duel) => [duel.loserController?.opponent ?? '', duel.loserController ?? ''],
                        gameAction: (duel) =>
                            AbilityDsl.actions.sequential([
                                AbilityDsl.actions.lookAt({
                                    target: this.#losersHand(duel),
                                    message: '{0} reveals their hand: {1}',
                                    messageArgs: (cards) => [duel.loserController, cards]
                                }),
                                AbilityDsl.actions.cardMenu({
                                    activePromptTitle: 'Choose card to discard',
                                    player: duel.loserController === context.player ? Players.Opponent : Players.Self,
                                    cards: this.#losersHand(duel),
                                    targets: true,
                                    message: '{0} chooses {1} to be discarded',
                                    messageArgs: (card) => [duel.loserController?.opponent ?? '', card],
                                    gameAction: AbilityDsl.actions.discardCard()
                                })
                            ])
                    }))
                }
            }
        });
    }

    #losersHand(duel: Duel): DrawCard[] {
        return duel.loserController?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [];
    }
}
