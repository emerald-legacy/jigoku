import type DrawCard from '../../../../../server/game/DrawCard.js';
import type { IntegrationContext } from '../../../../helpers/integrationhelper.js';

describe('Retreat to Safety', () => {
    integration(() => {
        let player1: IntegrationContext['player1'];
        let player2: IntegrationContext['player2'];
        let borderRider: DrawCard;
        let matsuBerserker: DrawCard;
        let kitsuMotso: DrawCard;
        let ikomaProdigy: DrawCard;
        let retreatToSafety: DrawCard;
        let initiateConflict: (_config: Record<string, unknown>) => void;
        let noMoreActions: () => void;
        let getChatLogs: (_n: number) => string[];

        beforeEach(function(this: IntegrationContext) {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'kitsu-motso', 'ikoma-prodigy'],
                    hand: ['retreat-to-safety']
                }
            });

            player1 = this.player1;
            player2 = this.player2;
            initiateConflict = (config) => this.initiateConflict(config);
            noMoreActions = () => this.noMoreActions();
            getChatLogs = (n) => this.getChatLogs(n);

            borderRider = player1.findCardByName('border-rider') as DrawCard;
            matsuBerserker = player2.findCardByName('matsu-berserker') as DrawCard;
            kitsuMotso = player2.findCardByName('kitsu-motso') as DrawCard;
            ikomaProdigy = player2.findCardByName('ikoma-prodigy') as DrawCard;
            retreatToSafety = player2.findCardByName('retreat-to-safety') as DrawCard;
            ikomaProdigy.bowed = true;
        });

        it('sends defenders home', () => {
            noMoreActions();
            initiateConflict({
                attackers: [borderRider],
                defenders: [matsuBerserker, kitsuMotso]
            });
            matsuBerserker.bowed = true;
            kitsuMotso.bowed = true;

            player2.clickCard(retreatToSafety);
            expect(player2).toHavePrompt('Retreat to Safety');
            expect(player2).toBeAbleToSelect(matsuBerserker);
            expect(player2).toBeAbleToSelect(kitsuMotso);

            player2.clickCard(matsuBerserker);
            player2.clickCard(kitsuMotso);
            player2.clickPrompt('Done');
            expect(matsuBerserker.isParticipating()).toBe(false);
            expect(kitsuMotso.isParticipating()).toBe(false);
            expect(getChatLogs(3)).toContain(
                'player2 plays Retreat to Safety to send Matsu Berserker and Kitsu Motso home'
            );

            expect(player2).toHavePrompt('Choose a character to ready');
            expect(player2).toBeAbleToSelect(matsuBerserker);
            expect(player2).toBeAbleToSelect(kitsuMotso);
            expect(player2).not.toBeAbleToSelect(ikomaProdigy);

            player2.clickCard(matsuBerserker);
            expect(getChatLogs(3)).toContain("Matsu Berserker is readied due to player2's superior leadership");
            expect(matsuBerserker.bowed).toBe(false);
            expect(kitsuMotso.bowed).toBe(true);
        });
    });
});
