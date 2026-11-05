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

            borderRider = player1.findDrawCard('border-rider');
            matsuBerserker = player2.findDrawCard('matsu-berserker');
            kitsuMotso = player2.findDrawCard('kitsu-motso');
            ikomaProdigy = player2.findDrawCard('ikoma-prodigy');
            retreatToSafety = player2.findDrawCard('retreat-to-safety');
            ikomaProdigy.bowed = true;
        });

        it('lets the player decline to ready a character', () => {
            noMoreActions();
            initiateConflict({
                attackers: [borderRider],
                defenders: [matsuBerserker, kitsuMotso]
            });
            matsuBerserker.bowed = true;
            kitsuMotso.bowed = true;

            player2.clickCard(retreatToSafety);
            player2.clickCard(matsuBerserker);
            player2.clickCard(kitsuMotso);
            player2.clickPrompt('Done');

            expect(player2).toHavePrompt('Choose a character to ready');
            expect(player2).toHavePromptButton('Done');
            player2.clickPrompt('Done');
            expect(matsuBerserker.bowed).toBe(true);
            expect(kitsuMotso.bowed).toBe(true);
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

describe('Retreat to Safety with characters on the other side than their controller', () => {
    integration(() => {
        let player1: IntegrationContext['player1'];
        let player2: IntegrationContext['player2'];
        let skirmisher1: DrawCard;
        let skirmisher2: DrawCard;
        let matsuBerserker: DrawCard;
        let retreatToSafety: DrawCard;
        let currentConflict: () => IntegrationContext['game']['currentConflict'];
        let getChatLogs: (_n: number) => string[];

        beforeEach(function(this: IntegrationContext) {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'endless-plains-skirmisher'],
                    hand: ['retreat-to-safety']
                }
            });

            player1 = this.player1;
            player2 = this.player2;
            currentConflict = () => this.game.currentConflict;
            getChatLogs = (n) => this.getChatLogs(n);

            skirmisher1 = player1.findDrawCard('endless-plains-skirmisher');
            skirmisher2 = player2.findDrawCard('endless-plains-skirmisher');
            matsuBerserker = player2.findDrawCard('matsu-berserker');
            retreatToSafety = player2.findDrawCard('retreat-to-safety');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [player1.findDrawCard('border-rider')],
                defenders: [matsuBerserker]
            });
            player2.clickCard(skirmisher2);
            player2.clickPrompt('player1');
            player1.clickCard(skirmisher1);
            player1.clickPrompt('player2');
        });

        it('chooses defending characters on your side, whoever controls them', () => {
            expect(currentConflict()?.attackers).toContain(skirmisher2);
            expect(currentConflict()?.defenders).toContain(skirmisher1);

            player2.clickCard(retreatToSafety);
            expect(player2).toBeAbleToSelect(matsuBerserker);
            expect(player2).toBeAbleToSelect(skirmisher1);
            expect(player2).not.toBeAbleToSelect(skirmisher2);

            player2.clickCard(skirmisher1);
            player2.clickPrompt('Done');
            expect(skirmisher1.isParticipating()).toBe(false);
            expect(getChatLogs(3)).toContain('player2 plays Retreat to Safety to send Endless Plains Skirmisher home');
        });
    });
});
