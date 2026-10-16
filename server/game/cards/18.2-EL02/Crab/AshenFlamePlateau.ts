import { ProvinceCard } from '../../../ProvinceCard.js';
import { charactersCannot } from '../../../effects.js';
import { msg } from '../../../GameChat.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class AshenFlamePlateau extends ProvinceCard {
    static id = 'ashen-flame-plateau';

    override setupCardAbilities() {
        this.reaction('Prevent opponent from triggering character abilities')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .conflictLastingEffect((context) => ({
                effect: [
                    charactersCannot({
                        cannot: RestrictionType.TriggerAbilities,
                        appliesTo: RestrictionScope.OpponentsCharacters,
                        applyingPlayer: context.player
                    }),
                    charactersCannot({
                        cannot: RestrictionType.InitiateKeywords,
                        appliesTo: RestrictionScope.OpponentsCharacters,
                        applyingPlayer: context.player
                    })
                ]
            }))
            .chatText((context) => msg`prevent ${context.player.opponent} from triggering character abilities this conflict`);
    }
}
