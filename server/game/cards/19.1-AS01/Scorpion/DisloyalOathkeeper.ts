import AbilityDsl from '../../../abilitydsl.js';
import type { TriggeredAbilityContext } from "../../../TriggeredAbilityContext.js";
import { CardTypes, Locations, Players, PlayTypes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type Player from '../../../player.js';

export default class DisloyalOathkeeper extends DrawCard {
    static id = 'disloyal-oathkeeper';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card) => card.location === this.uuid,
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player: Player) => player === this.controller,
                    PlayTypes.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.reaction({
            title: 'Put card under this',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    event.card.type === CardTypes.Event &&
                    !event.card.hasEphemeral() &&
                    context.source.controller.getSourceList(this.uuid).length === 0
            },
            gameAction: AbilityDsl.actions.placeCardUnderneath((context) => ({
                target: (context as TriggeredAbilityContext).event.card,
                hideWhenFaceup: true,
                destination: this
            }))
        });
    }
}
