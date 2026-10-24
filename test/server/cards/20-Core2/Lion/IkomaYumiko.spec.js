import { GameMode } from '../../../../../build/server/GameMode.js';

describe('Ikoma Yumiko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    dynastyDiscard: ['ikoma-yumiko']
                }
            });
            this.yumiko = this.player1.placeCardInProvince('ikoma-yumiko', 'province 1');
        });

        it('claims the Imperial Favor after entering play', function() {
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Yumiko to claim the Emperor\'s favor');
        });
    });
});

describe('Ikoma Yumiko in Emerald', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    dynastyDiscard: ['ikoma-yumiko']
                },
                gameMode: GameMode.Emerald
            });
            this.yumiko = this.player1.placeCardInProvince('ikoma-yumiko', 'province 1');
        });

        it('names the Empress\' favor', function() {
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.yumiko);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Yumiko to claim the Empress\' favor');
        });
    });
});
