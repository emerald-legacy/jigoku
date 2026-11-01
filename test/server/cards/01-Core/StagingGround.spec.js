describe('Staging Ground', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['staging-ground', 'akodo-gunso', 'doji-whisperer', 'border-rider']
                },
                player2: {
                    dynastyDiscard: ['hida-guardian']
                }
            });
            this.stagingGround = this.player1.placeCardInProvince('staging-ground', 'province 1');
            this.gunso = this.player1.placeCardInProvince('akodo-gunso', 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 3');
            this.borderRider = this.player1.placeCardInProvince('border-rider', 'province 4');
            this.guardian = this.player2.placeCardInProvince('hida-guardian', 'province 1');
            this.gunso.facedown = true;
            this.whisperer.facedown = true;
            this.borderRider.facedown = true;
            this.guardian.facedown = true;
        });

        it('turns 2 chosen facedown cards in your provinces faceup', function() {
            this.player1.clickCard(this.stagingGround);
            expect(this.player1).toHavePrompt('Choose up to 2 cards');
            this.player1.clickCard(this.gunso);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Done');
            expect(this.gunso.facedown).toBe(false);
            expect(this.whisperer.facedown).toBe(false);
            expect(this.borderRider.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Staging Ground to reveal the facedown cards in province 2 and province 3');
        });

        it('turns a single chosen facedown card faceup', function() {
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Done');
            expect(this.whisperer.facedown).toBe(false);
            expect(this.gunso.facedown).toBe(true);
            expect(this.borderRider.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Staging Ground to reveal the facedown card in province 3');
        });

        it('cannot choose more than 2 cards', function() {
            this.player1.clickCard(this.stagingGround);
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            this.player1.clickCard(this.gunso);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.borderRider);
            this.player1.clickPrompt('Done');
            expect(this.gunso.facedown).toBe(false);
            expect(this.whisperer.facedown).toBe(false);
            expect(this.borderRider.facedown).toBe(true);
        });

        it('cannot choose a faceup card or a card in an opponent\'s province', function() {
            this.whisperer.facedown = false;
            this.player1.clickCard(this.stagingGround);
            expect(this.player1).toHavePrompt('Choose up to 2 cards');
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.guardian);
        });
    });
});
