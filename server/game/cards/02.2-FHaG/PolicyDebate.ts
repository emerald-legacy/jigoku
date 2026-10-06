import { CardType, DuelType, Players } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import { cardMenu, discardCard, duel, lookAt, sequential } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class PolicyDebate extends DrawCard {
    static id = 'policy-debate';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .target({
                name: 'challenger',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            })
            .target({
                name: 'duelTarget',
                dependsOn: 'challenger',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, duel((context) => ({
                type: DuelType.Political,
                challenger: context.targets.challenger,
                message: '{0} sees {1}\'s hand and chooses a card to discard',
                messageArgs: (duel) => [duel.loserController?.opponent ?? '', duel.loserController ?? ''],
                gameAction: (duel) =>
                    sequential([
                        lookAt({
                            target: this.losersHand(duel),
                            message: '{0} reveals their hand: {1}',
                            messageArgs: (cards) => [duel.loserController, cards]
                        }),
                        cardMenu({
                            activePromptTitle: 'Choose card to discard',
                            player: duel.loserController === context.player ? Players.Opponent : Players.Self,
                            cards: this.losersHand(duel),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: (card) => [duel.loserController?.opponent ?? '', card],
                            gameAction: discardCard()
                        })
                    ])
            })));
    }

    private losersHand(duel: Duel): DrawCard[] {
        return duel.loserController?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [];
    }
}
