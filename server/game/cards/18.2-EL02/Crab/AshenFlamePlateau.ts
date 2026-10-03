import { Duration } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AshenFlamePlateau extends ProvinceCard {
    static id = 'ashen-flame-plateau';

    setupCardAbilities() {
        this.reaction('Prevent opponent from triggering character abilities')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(AbilityDsl.actions.conflictLastingEffect((context) => ({
                duration: Duration.UntilEndOfConflict,
                effect: [
                    AbilityDsl.effects.charactersCannot({
                        cannot: 'triggerAbilities',
                        restricts: 'opponentsCharacters',
                        applyingPlayer: context.player
                    }),
                    AbilityDsl.effects.charactersCannot({
                        cannot: 'initiateKeywords',
                        restricts: 'opponentsCharacters',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .effect('prevent {1} from triggering character abilities this conflict', (context) => [context.player.opponent]);
    }
}
