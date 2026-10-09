import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { playCard } from '../../GameActions/GameActions.js';
import { CardType, Location, Players, PlayType } from '../../Constants.js';

class Kunshu extends DrawCard {
    static id = 'kunshu';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.whileAttached({
            effect: gainAbility.action('Play a card', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .cost(costs.discardImperialFavor())
                .target({
                    cardType: [CardType.Event, CardType.Attachment],
                    location: [Location.ConflictDiscardPile],
                    player: Players.Self,
                    controller: Players.Opponent
                }, playCard(() => ({
                    playType: PlayType.Other,
                    ignoreFateCost: true,
                    source: this
                })))
                .chatText('play {0}'))
        });
    }
}


export default Kunshu;
