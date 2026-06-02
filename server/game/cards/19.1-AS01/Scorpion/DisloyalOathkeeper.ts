import AbilityDsl from '../../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { CardType, Location, Players, PlayType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class DisloyalOathkeeper extends DrawCard {
    static id = 'disloyal-oathkeeper';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card) => card.location === this.uuid,
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player: Player) => player === this.controller,
                    PlayType.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.reaction({
            title: 'Put card under this',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    event.card.type === CardType.Event &&
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
