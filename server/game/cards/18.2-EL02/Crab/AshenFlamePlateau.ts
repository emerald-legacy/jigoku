import { ProvinceCard } from '../../../ProvinceCard.js';
import { charactersCannot } from '../../../effects.js';
import { conflictLastingEffect } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class AshenFlamePlateau extends ProvinceCard {
    static id = 'ashen-flame-plateau';

    setupCardAbilities() {
        this.reaction('Prevent opponent from triggering character abilities')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(conflictLastingEffect((context) => ({
                effect: [
                    charactersCannot({
                        cannot: 'triggerAbilities',
                        restricts: 'opponentsCharacters',
                        applyingPlayer: context.player
                    }),
                    charactersCannot({
                        cannot: 'initiateKeywords',
                        restricts: 'opponentsCharacters',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .effect((context) => msg`prevent ${context.player.opponent} from triggering character abilities this conflict`);
    }
}
