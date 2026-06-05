import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, Location, Players, PlayType } from '../../Constants.js';

class Kunshu extends DrawCard {
    static id = 'kunshu';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Play a card',
                cost: AbilityDsl.costs.discardImperialFavor(),
                condition: (context: AbilityContext<this>) => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: [CardType.Event, CardType.Attachment],
                    location: [Location.ConflictDiscardPile],
                    player: Players.Self,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.playCard(() => ({
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
