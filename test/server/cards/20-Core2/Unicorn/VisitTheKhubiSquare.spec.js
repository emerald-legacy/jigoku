describe('Visit the Khubi Square', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger']
                },
                player2: {
                    provinces: ['visit-the-khubi-square'],
                    dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'hida-kisada', 'borderlands-defender', 'hida-guardian']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.khubi = this.player2.findCardByName('visit-the-khubi-square', 'province 1');
            this.storehouse = this.player2.findCardByName('imperial-storehouse');
            this.favorableGround = this.player2.findCardByName('favorable-ground');
            this.kisada = this.player2.findCardByName('hida-kisada');
            this.borderlands = this.player2.findCardByName('borderlands-defender');
            this.hidaGuardian = this.player2.findCardByName('hida-guardian');
            this.player2.moveCard(this.borderlands, 'dynasty deck');
            this.player2.moveCard(this.storehouse, 'dynasty deck');
            this.player2.moveCard(this.favorableGround, 'dynasty deck');
            this.player2.moveCard(this.kisada, 'dynasty deck');
            this.player2.moveCard(this.hidaGuardian, 'dynasty deck');
        });

        it('should put a character costing 2 or less from the top 5 cards into play and discard the rest', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                province: this.khubi
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.khubi);
            this.player2.clickCard(this.khubi);
            expect(this.player2).toHaveDisabledPromptButton('Imperial Storehouse');
            expect(this.player2).toHaveDisabledPromptButton('Favorable Ground');
            expect(this.player2).toHaveDisabledPromptButton('Hida Kisada');
            expect(this.player2).toHavePromptButton('Hida Guardian');
            this.player2.clickPrompt('Hida Guardian');
            expect(this.hidaGuardian.location).toBe('play area');
            expect(this.kisada.location).toBe('dynasty discard pile');
            expect(this.storehouse.location).toBe('dynasty discard pile');
            expect(this.favorableGround.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player2 puts Hida Guardian into play');
        });

        it('should not trigger when a conflict is declared against another province', function() {
            const otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                province: otherProvince
            });
            expect(this.player2).toHavePrompt('Choose defenders');
        });
    });
});
