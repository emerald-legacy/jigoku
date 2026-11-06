import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, sendHome } from '../../GameActions/GameActions.js';
import { CardType, Players, RestrictionType, RestrictionScope } from '../../Constants.js';

class DirectingTheBattle extends DrawCard {
    static id = 'directing-the-battle';

    override setupCardAbilities() {
        this.action('Direct the Battle')
            .condition((context) => context.game.isDuringConflict())
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Any
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: (context) => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Move this character home': {
                    action: sendHome((context) => ({
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`send ${context.targets.character} home`
                },
                'Give +3 Military': {
                    action: cardLastingEffect((context) => ({
                        effect: modifyMilitarySkill(3),
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`give ${context.targets.character} +3${'military'}`
                },
                'Prevent bowing during conflict': {
                    action: cardLastingEffect((context) => ({
                        effect: cardCannot({
                            cannot: RestrictionType.Bow,
                            appliesTo: RestrictionScope.OpponentsCardEffects,
                            applyingPlayer: context.player
                        }),
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`prevent ${context.targets.character}${' from being bowed by opponent\'s card effects'}`
                }
            });
    }
}


export default DirectingTheBattle;
