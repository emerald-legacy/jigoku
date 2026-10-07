import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { playCard } from '../../GameActions/GameActions.js';
import { AbilityType, CardType, Location, Players, PlayType } from '../../Constants.js';

class Kunshu extends DrawCard {
    static id = 'kunshu';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Play a card',
                cost: costs.discardImperialFavor(),
                condition: (context) => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: [CardType.Event, CardType.Attachment],
                    location: [Location.ConflictDiscardPile],
                    player: Players.Self,
                    controller: Players.Opponent,
                    gameAction: playCard(() => ({
                        playType: PlayType.Other,
                        ignoreFateCost: true,
                        source: this
                    }))
                },
                effect: 'play {0}'
            })
        });
    }
}


export default Kunshu;
